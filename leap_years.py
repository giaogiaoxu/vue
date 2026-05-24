def is_leap_year(year):
    """Return True if year is a leap year."""
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


def next_leap_years(start_year, count=10):
    """Return the next `count` leap years starting from `start_year` (inclusive)."""
    results = []
    year = start_year
    while len(results) < count:
        if is_leap_year(year):
            results.append(year)
        year += 1
    return results


if __name__ == "__main__":
    start = int(input("Enter a starting year: "))
    leap_years = next_leap_years(start)
    print(f"Next 10 leap years from {start}:")
    for y in leap_years:
        print(y)
