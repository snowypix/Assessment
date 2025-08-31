using backend.Infrastructure.Persistence;
using backend.Infrastructure.Repositories;
using backend.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class TripRepositoryTests
{
    private readonly AppDbcontext _context;
    private readonly TripRepository _repo;

    public TripRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<AppDbcontext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;
        _context = new AppDbcontext(options);
        _repo = new TripRepository(_context);
    }

    [Fact]
    public async Task AddTrip_ShouldSaveTrip()
    {
        var trip = new Trip { Code = 1, DepartureDate = DateTime.UtcNow.AddHours(1) };
        await _repo.AddAsync(trip);
        var saved = await _context.Trips.FindAsync(1);
        Assert.NotNull(saved);
        Assert.Equal(trip.Code, saved.Code);
    }
}
