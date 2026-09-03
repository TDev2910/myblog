<?php

namespace App\Http\Controllers;

use App\Services\MomentService;
use Inertia\Inertia;
use Inertia\Response;

class MomentController extends Controller
{
    public function __construct(private readonly MomentService $moments) {}

    public function index(): Response
    {
        return Inertia::render('moments/index', [
            'moments' => $this->moments->paginatePublished(),
        ]);
    }
}
