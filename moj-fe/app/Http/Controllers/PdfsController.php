<?php

namespace App\Http\Controllers;

//use App\Exceptions\VideoNotFoundException;
use App\Facades\Pdfs;
use App\Http\Controllers\Controller;
use App\Helpers\PdfBackLink;
//use App\Models\Video;
//use App\User;

class PdfsController extends Controller {

  function showPdfLandingPage($tid) {
    $categories = Pdfs::landingPagePdfs($tid);
    $backlink = PdfBackLink::getBackLink();

    return view('pdf.landingPage', [
      'categories' => $categories,
      'backlink' => $backlink
    ]);
  }

  function show($tid) {
      $pdfs = Pdfs::show($tid);
      $backlink = PdfBackLink::getBackLink();

	  return view('pdf.detail', [
      'pdfs' => $pdfs,
      'backlink' => $backlink
    ]);
  }
}
