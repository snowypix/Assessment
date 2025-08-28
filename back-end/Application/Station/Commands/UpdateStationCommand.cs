using MediatR;
using backend.Domain.Models;

namespace backend.Application.Stations.Commands
{
    public record UpdateStationCommand(int Id, string Name) : IRequest<Station?>;
}
