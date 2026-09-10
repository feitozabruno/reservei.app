using System;
using System.Collections.Generic;

namespace Reservei.Api.DTOs.Shared;

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new List<T>();

    public int TotalCount { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }

    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasNextPage => CurrentPage < TotalPages;
    public bool HasPreviousPage => CurrentPage > 1;
}