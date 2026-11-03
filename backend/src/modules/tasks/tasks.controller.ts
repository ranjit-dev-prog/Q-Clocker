import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { CreateTaskCommentDto } from './dto/task-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Task Management')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new enterprise task with random TSK reference' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List and filter tasks by status, department, priority, or keyword' })
  @ApiResponse({ status: 200, description: 'Returns filtered task list' })
  async findAll(@Query() query: TaskQueryDto, @CurrentUser() user: any) {
    return this.tasksService.findAll(query, user);
  }

  @Get('kanban')
  @ApiOperation({ summary: 'Get Kanban board with columns: Backlog, In Progress, Review, Completed' })
  @ApiResponse({ status: 200, description: 'Returns grouped tasks for Kanban UI' })
  async getKanban(@CurrentUser() user: any) {
    return this.tasksService.getKanbanBoard(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get complete task details, assignments, comments and dependencies' })
  @ApiResponse({ status: 200, description: 'Task details' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task properties, assignee, dates, or estimates' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status via Kanban drag-and-drop' })
  @ApiResponse({ status: 200, description: 'Task status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.updateStatus(id, dto, user);
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a comment or internal note to a task' })
  @ApiResponse({ status: 201, description: 'Comment recorded' })
  async addComment(
    @Param('id') id: string,
    @Body() dto: CreateTaskCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.addComment(id, dto, user);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get all comments for a task' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  async getComments(@Param('id') id: string) {
    return this.tasksService.getComments(id);
  }
}
