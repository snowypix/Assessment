using back_end.Application.DTOs;
using backend.Application.Stations.Handlers;
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
    public class TripController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TripController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetAll()
            => Ok(await _mediator.Send(new GetAllTripsQuery()));
        [Authorize(Policy = "ManageTrips")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetById(int id)
        {
            var Trip = await _mediator.Send(new GetTripByIdQuery(id));
            return Trip == null ? NotFound() : Ok(Trip);
        }
        [Authorize(Policy = "ManageTrips")]
        [HttpPost]
        public async Task<ActionResult<Trip>> Create(CreateTripCommand command)
        {
            var Trip = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = Trip.Code }, Trip);
        }
        [Authorize(Policy = "ManageTrips")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Trip>> Update(int id, UpdateTripDTO updateDto)
        {
            var command = new UpdateTripCommand
            (
                id, updateDto.DepartureDate, updateDto.Duration, updateDto.Delay, updateDto.Status, updateDto.Price, updateDto.DepartureStationId, updateDto.ArrivalStationId, updateDto.TrainId
            );
            var updated = await _mediator.Send(command);
            return updated == null ? NotFound() : Ok(updated);
        }
        [Authorize(Policy = "ManageTrips")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _mediator.Send(new DeleteTripCommand(id));
            return success ? NoContent() : NotFound();
        }
    }
}
