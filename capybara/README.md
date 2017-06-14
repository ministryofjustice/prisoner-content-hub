Capybara tests
==============

More on Capybara can be found here

https://github.com/teamcapybara/capybara

Running the tests
-----------------

To run the tests run the following commands

    bundle install
    HUB_ENV_URL=http://localhost:8181 bundle exec rake test

The environment variable HUB_ENV_URL should be set to the URL of the frontend of the environment you would like to test.

If the tests pass you should get a message in the console saying "Pass" and if they fail you will get a message "FAIL" with an exit code of -1.

Adding more tests
-----------------

The path of the tests is defined in the Rakefile as shown below

      t.test_files = FileList['tests/*.rb']

This means any file in the tests directory will run. The current test in there is configured to use the environment variable HUB_ENV_URL for the frontend, please continue to follow this convention.
