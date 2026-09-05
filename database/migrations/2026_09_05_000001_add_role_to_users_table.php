<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('staff')->after('email');
        });

        // Every account created before roles existed had full, undifferentiated
        // admin access. Preserve that instead of silently demoting existing
        // accounts to the new-user default of 'staff'. Only accounts created
        // after this migration need an explicit role choice.
        DB::table('users')->update(['role' => 'superadmin']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
