## REQUIREMENTS

None.

## INSTALLATION

* Install as usual.
* You can enable the endpoint through the [REST UI](http://www.drupal.org/project/restui) module

## CONFIGURATION

Once the module has been installed, navigate to `admin/config/services/rest_menu_items`
(`Configuration > Web Services > Rest Menu Items` through the administration panel) and
configure the available values you want to output in the JSON.

## TROUBLESHOOTING

* If you get a `406 - Not Acceptable` error you need to add the `?_format=json|hal_json|xml` attribute to the URL.

  See https://www.drupal.org/node/2790017 for further information.

## CONTACT

Current maintainers:
* Fabian de Rijk ([fabianderijk](https://www.drupal.org/u/fabianderijk))

## Sponsors

This project has been sponsored by:
* [Finalist](https://www.drupal.org/finalist)
* [Youwe](https://www.drupal.org/youwe)
