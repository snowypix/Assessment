using backend.Application.DTOs;
using MediatR;

namespace backend.Application.Tickets.Commands
{
    public class BuyTicketCommand : IRequest<TicketDto>
    {
        public int TripId { get; set; }
        public int Class { get; set; } // could be enum later: Economy/First, etc.
    }
}
