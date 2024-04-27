using System;
using System.Security.Cryptography;
using System.Text;

public static class PasswordHashing
{
    const int keySize = 64;
    const int iterations = 350000;
    static HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

    public static string HashPassword(string password, string salt)
    {
        byte[] bytesalt = Encoding.UTF8.GetBytes(salt);
        using (var rng = RandomNumberGenerator.Create())
        {   
            rng.GetBytes(bytesalt);
        }

        using (var pbkdf2 = new Rfc2898DeriveBytes(password, bytesalt, iterations, hashAlgorithm))
        {
            byte[] hash = pbkdf2.GetBytes(keySize);
            return BitConverter.ToString(hash).Replace("-", string.Empty);
        }
    }
}


public static class SaltGenerator
{
    public static string GenerateSalt(int size)
    {
            var randomNumber = new byte[size];
            string salt = "";

        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            salt = Convert.ToBase64String(randomNumber);
        }
        return salt;
            }
}