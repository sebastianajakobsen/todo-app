<?php

namespace App\Http\Controllers;

use App\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // vue axios is sending access_token in header -> axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.access_token
        // Laravel then checks if auth user base on tokens have any todos
        $todos = Auth::user()->todos;
        return response()->json($todos, 200); // 200 OK
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'completed' => 'required|boolean',
        ]);


        // vue axios is sending access_token in header -> axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.access_token
        // Laravel then checks if auth user base on tokens have any todos
        $todo = Auth::user()->todos()->create($data);
        return response()->json($todo, 201); // 201 Created
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function show(Todo $todo)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Todo $todo)
    {
        //
        // check if todo user id matched auth user id
        if($todo->user_id !== Auth::user()->id) {
            return response()->json('Unauthorized', 401);
        }

        $data = $request->validate([
            'title' => 'required|string',
            'completed' => 'required|boolean'
        ]);


        $todo->update($data);

        return response()->json($todo, 200); // 200 OK
    }

    public function updateAll(Request $request)
    {

        $data = $request->validate([
            'completed' => 'required|boolean',
        ]);

        $todo = Todo::where('user_id', Auth::user()->id)->update($data);

        return response()->json('Updated '.$todo.' Items', 200); // 200 OK

    }

    public function destroyCompleted(Request $request)
    {

        Auth::user()->todos()->where('completed', true)->delete();

        return response()->json('Deleted', 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Todo $todo
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Todo $todo)
    {

        // check if todo user id matched auth user id
        if($todo->user_id !== Auth::user()->id) {
            return response()->json('Unauthorized', 401);
        }

        $todo->delete();
        return response()->json('Todo Deleted', 200); // 200 OK

    }
}
