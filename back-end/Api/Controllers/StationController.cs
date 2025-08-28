using back_end.Application.DTOs;
using backend.Application.Stations.Commands;
using backend.Application.Stations.Queries;
using backend.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StationController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Station>>> GetAll()
            => Ok(await _mediator.Send(new GetAllStationsQuery()));
        [Authorize(Policy = "ManageStations")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Station>> GetById(int id)
        {
            var station = await _mediator.Send(new GetStationByIdQuery(id));
            return station == null ? NotFound() : Ok(station);
        }
        [Authorize(Policy = "ManageStations")]
        [HttpPost]
        public async Task<ActionResult<Station>> Create(CreateStationCommand command)
        {
            var station = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = station.Code }, station);
        }
        [Authorize(Policy = "ManageStations")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Station>> Update(int id, UpdateStationDto updateDto)
        {
            var command = new UpdateStationCommand
            (
                id,
                updateDto.Name
            );
            var updated = await _mediator.Send(command);
            return updated == null ? NotFound() : Ok(updated);
        }
        [Authorize(Policy = "ManageStations")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _mediator.Send(new DeleteStationCommand(id));
            return success ? NoContent() : NotFound();
        }
    }
}
