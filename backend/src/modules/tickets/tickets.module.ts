import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketStateMachineService } from './services/ticket-state-machine.service';
import { TicketSlaService } from './services/ticket-sla.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, TicketStateMachineService, TicketSlaService],
  exports: [TicketsService, TicketStateMachineService, TicketSlaService],
})
export class TicketsModule {}
