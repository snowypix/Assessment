using back_end.Application.DTOs;
using backend.Application.Interfaces;
using backend.Application.Trips.Queries;
using backend.Domain.Models;
using backend.Infrastructure.Persistence;
using backend.Infrastructure.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Trips.Handlers
{
    public class CheckSchedulesHandler : IRequestHandler<CheckSchedulesQuery, IEnumerable<TripScheduleDTO>>
    {
        private readonly AppDbcontext _db;
        private readonly ITripRepository _repo;
        public CheckSchedulesHandler(AppDbcontext db, ITripRepository repo)
        {
            _db = db;
            _repo = repo;
        }

        public async Task<IEnumerable<TripScheduleDTO>> Handle(CheckSchedulesQuery request, CancellationToken ct)
        {
            return await _repo.GetSchedules(request.DepartureStationId, request.ArrivalStationId, request.DepartureTime, ct);
        }
    }
}
