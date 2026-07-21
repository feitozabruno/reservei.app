using System;

namespace Reservei.Api.Exceptions;

public class ValidationException(string message) : Exception(message) { }