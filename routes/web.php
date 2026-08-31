<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Two single-page React apps served from Blade shells:
|   /        → the public PERJODA website
|   /admin   → the staff operations panel
*/

Route::view('/', 'app')->name('home');

Route::view('/admin/{path?}', 'admin')->where('path', '.*')->name('admin');

Route::fallback(fn () => view('app'));
