import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketStateMachineService } from './services/ticket-state-machine.service';
import { TicketSlaService } from './services/ticket-sla.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [TicketsController],
  providers: [TicketsService, TicketStateMachineService, TicketSlaService],
  exports: [TicketsService, TicketStateMachineService, TicketSlaService],
})
export class TicketsModule {}
