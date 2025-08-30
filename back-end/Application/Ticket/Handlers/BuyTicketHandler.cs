using AccountService.Exceptions;
using backend.Application.Abstractions;
using backend.Application.DTOs;
using backend.Application.Interfaces;
using backend.Application.Tickets.Commands;
using backend.Domain.Models;
using backend.Infrastructure.Repositories;
using backend.Infrastructure.Security;
using MediatR;

public class BuyTicketHandler : IRequestHandler<BuyTicketCommand, TicketDto>
{
    private readonly ITicketRepository _ticketRepo;
    private readonly ICurrentUserService _currentUser;
    private readonly IEncryptedQrGenerator _qrGen;
    public BuyTicketHandler(ITicketRepository ticketRepo, ICurrentUserService currentUser, IEncryptedQrGenerator qrGen)
    {
        _ticketRepo = ticketRepo;
        _currentUser = currentUser;
        _qrGen = qrGen;
    }

    public async Task<TicketDto> Handle(BuyTicketCommand command, CancellationToken ct)
    {
        var trip = await _ticketRepo.GetTripByIdAsync(command.TripId, ct);
        if (trip == null) throw new BusinessRuleException("Trip not found");

        var ticket = new Ticket
        {
            TripId = command.TripId,
            Trip = trip,
            ClientId = _currentUser.UserId,
            Class = command.Class,
        };
        ticket.CalculatePrice();

        var encrypted = _qrGen.Generate(ticket);
        ticket.AttachQrCode(encrypted);
        var created = await _ticketRepo.AddAsync(ticket, ct);

        return new TicketDto
        {
            Code = created.Code,
            TripId = created.TripId,
            ClientId = created.ClientId,
            Class = created.Class,
            Price = created.Price,
            QrCode = created.QrCode
        };
    }
}
