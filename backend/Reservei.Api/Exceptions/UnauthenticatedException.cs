using System;

namespace Reservei.Api.Exceptions;

public class UnauthenticatedException(string message) : Exception(message) { }