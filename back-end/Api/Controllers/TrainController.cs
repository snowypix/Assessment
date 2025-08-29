using back_end.Application.DTOs;
using backend.Application.Stations.Handlers;
using backend.Application.Trains.Commands;
using backend.Application.Trains.Queries;
using backend.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TrainController(IMediator mediator) => _mediator = mediator;
        [Authorize(Policy = "ManageTrains")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Train>>> GetAll()
            => Ok(await _mediator.Send(new GetAllTrainsQuery()));
        [Authorize(Policy = "ManageTrains")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Train>> GetById(int id)
        {
            var train = await _mediator.Send(new GetTrainByIdQuery(id));
            return train == null ? NotFound() : Ok(train);
        }
        [Authorize(Policy = "ManageTrains")]
        [HttpPost]
        public async Task<ActionResult<Train>> Create(CreateTrainCommand command)
        {
            var train = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = train.Code }, train);
        }
        [Authorize(Policy = "ManageTrains")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Train>> Update(int id, UpdateTrainDTO updateDto)
        {
            var command = new UpdateTrainCommand
            (
                id,
                updateDto.Type,
                updateDto.Capacity,
                updateDto.Status
            );
            var updated = await _mediator.Send(command);
            return updated == null ? NotFound() : Ok(updated);
        }
        [Authorize(Policy = "ManageTrains")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _mediator.Send(new DeleteTrainCommand(id));
            return success ? NoContent() : NotFound();
        }
    }
}
