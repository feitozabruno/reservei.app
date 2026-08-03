using System;

namespace Reservei.Api.Exceptions;

public class NotFoundException(string message) : Exception(message) { }