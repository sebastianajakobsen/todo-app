<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    //
    public function user() {
        return $this->belongsTo('App\User', 'user_id');
    }

    protected $fillable = ['title', 'completed'];
}
