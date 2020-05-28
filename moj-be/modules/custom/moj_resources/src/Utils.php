<?php
function getPrisonResults($prison_id, $results) {
  $prison_ids = [
    792, // berwyn
    793, // wayland
    959  // cookham wood
  ];

  if (in_array($prison_id, $prison_ids)) {
    $prison_results = $results
      ->orConditionGroup()
      ->condition('field_moj_prisons', $prison_id, '=')
      ->condition('field_moj_prisons', '', '=')
      ->notExists('field_moj_prisons');
    $results->condition($prison_results);
  }

  return $results;
}
?>
