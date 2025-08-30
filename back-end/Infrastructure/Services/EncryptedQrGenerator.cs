using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using backend.Application.Abstractions;
using backend.Domain.Models;
using Microsoft.Extensions.Options;

namespace backend.Infrastructure.Security
{
    public sealed class QrCryptoOptions
    {
        public string Base64Key { get; set; } = string.Empty;
        public int ExpiryMinutes { get; set; } = 180;
        public byte Version { get; set; } = 1;
    }
    public class EncryptedQrGenerator : IEncryptedQrGenerator
    {
        private readonly byte[] _key;

        public EncryptedQrGenerator(IOptions<QrCryptoOptions> opts)
        {
            _key = Convert.FromBase64String(opts.Value.Base64Key);
        }


        public string Generate(Ticket ticket)
        {
            var payload = new
            {
                TicketCode = ticket.Code,
                ticket.ClientId,
                ticket.TripId,
                ticket.Class,
                ticket.Price,
                iat = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            var json = JsonSerializer.Serialize(payload);
            var plaintext = Encoding.UTF8.GetBytes(json);

            var nonce = RandomNumberGenerator.GetBytes(12);
            var ciphertext = new byte[plaintext.Length];
            var tag = new byte[16];

            using var aes = new AesGcm(_key);
            aes.Encrypt(nonce, plaintext, ciphertext, tag);

            var combined = new byte[nonce.Length + ciphertext.Length + tag.Length];
            Buffer.BlockCopy(nonce, 0, combined, 0, nonce.Length);
            Buffer.BlockCopy(ciphertext, 0, combined, nonce.Length, ciphertext.Length);
            Buffer.BlockCopy(tag, 0, combined, nonce.Length + ciphertext.Length, tag.Length);

            return Convert.ToBase64String(combined);
        }
    }
}
