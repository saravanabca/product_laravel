<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    @include('layouts.meta')

    @include('layouts.top_style')

    @yield('custom_style')
</head>

<body>

    @yield('content')

    @include('layouts.top_scripts')

    @yield('custom_scripts')

</body>

</html>