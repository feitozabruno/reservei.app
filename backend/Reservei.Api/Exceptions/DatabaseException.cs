using System;

namespace Reservei.Api.Exceptions;

public class DatabaseException(string message) : Exception(message) { }