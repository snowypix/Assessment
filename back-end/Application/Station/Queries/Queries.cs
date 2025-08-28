using MediatR;
using backend.Domain.Models;

namespace backend.Application.Stations.Queries
{
    public record GetStationByIdQuery(int Id) : IRequest<Station?>;
    public record GetAllStationsQuery() : IRequest<IEnumerable<Station>>;
}
