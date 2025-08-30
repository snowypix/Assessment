using back_end.Application.DTOs;
using backend.Application.Stations.Handlers;
using backend.Application.Tickets.Commands;
using backend.Application.Trips.Commands;
using backend.Application.Trips.Queries;
using backend.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TicketController(IMediator mediator) => _mediator = mediator;

        [Authorize(Policy = "CreateTicket")]
        [HttpPost]
        public async Task<ActionResult<Trip>> BuyTicket(BuyTicketCommand command)
        {
            var Ticket = await _mediator.Send(command);
            return CreatedAtAction(nameof(BuyTicket), new { id = Ticket.Code }, Ticket);
        }

    }
}
