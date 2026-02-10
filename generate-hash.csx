using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

const int IterationCount = 100000;
const int SaltSize = 128 / 8; // 16 bytes
const int HashSize = 256 / 8; // 32 bytes

string password = "Admin123!";

// Generate salt
byte[] salt = new byte[SaltSize];
using (var rng = RandomNumberGenerator.Create())
{
    rng.GetBytes(salt);
}

// Generate hash
byte[] hash = KeyDerivation.Pbkdf2(
    password: password,
    salt: salt,
    prf: KeyDerivationPrf.HMACSHA256,
    iterationCount: IterationCount,
    numBytesRequested: HashSize
);

// Combine format marker, iteration count, salt, and hash
byte[] hashBytes = new byte[1 + 4 + SaltSize + HashSize];
hashBytes[0] = 0x01; // Version 1
BitConverter.GetBytes(IterationCount).CopyTo(hashBytes, 1);
salt.CopyTo(hashBytes, 5);
hash.CopyTo(hashBytes, 5 + SaltSize);

string result = Convert.ToBase64String(hashBytes);
Console.WriteLine($"PBKDF2 Hash for '{password}': {result}");
