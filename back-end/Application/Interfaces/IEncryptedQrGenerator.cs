using backend.Domain.Models;

namespace backend.Application.Abstractions
{
    public interface IEncryptedQrGenerator
    {
        string Generate(Ticket ticket);
    }
}
