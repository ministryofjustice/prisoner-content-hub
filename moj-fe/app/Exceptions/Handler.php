<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
	public function render($request, Exception $e)
	{
        // Convert a Guzzle BadResponseException to an HttpException before rendering
        if ($e instanceof \GuzzleHttp\Exception\BadResponseException) {
            $response = $e->getResponse();

            $message = $response->getReasonPhrase();

            $contentType = $response->getHeader('Content-Type');
            $contentType = array_shift($contentType);

            // Pull the message from a JSON response body
            if ($contentType == 'application/json') {
                $body = json_decode($response->getBody());

                if (property_exists($body, 'message')) {
                    $message = $body->message;
                }
            }

            return $this->render($request, new HttpException($e->getCode(), $message));
        }

		return parent::render($request, $e);
	}
}
