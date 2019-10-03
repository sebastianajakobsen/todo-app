<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //
    public function login(Request $request)
    {

//        $email = $request->input('username');
//        $user = User::where('email','=',$email)->first();
//
//        if($user && $user->role === 'admin'){
//            $request->request->add([
//                'scope' => 'manage-everything'
//            ]);
//
//        }else{
//            $request->request->add([
//                'scope' => 'read-only'
//            ]);
//        }

        $request->request->add([
            'grant_type' => 'password',
            'client_id' => config('services.passport.client_id'),
            'client_secret' => config('services.passport.client_secret'),
            'scope' => '*'
        ]);

        // forward the request to the oauth token request endpoint
        $tokenRequest = Request::create('/oauth/token', 'post');

        return Route::dispatch($tokenRequest);
    }


    public function register(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255|alpha_num|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        return User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

    }

    public function logout()
    {

        // logout from current device
//        Auth::user()->token()->revoke();

       $token = Auth::user()->token()->first();

        DB::table('oauth_refresh_tokens')
            ->where('access_token_id', $token->id)
            ->delete();

        Auth::user()->token()->delete();

        // logout from all devices
//        Auth::user()->tokens->each(function ($token, $key) {
//            $token->delete();
//        });
        return response()->json('Logged out successfully', 200);
    }
}
