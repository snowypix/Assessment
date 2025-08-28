using MediatR;
using backend.Domain.Models;

namespace backend.Application.Trains.Queries
{
    public record GetTrainByIdQuery(int Id) : IRequest<Train?>;
    public record GetAllTrainsQuery() : IRequest<IEnumerable<Train>>;
}
