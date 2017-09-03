#!/usr/bin/env ruby

require 'capybara'
require 'capybara/poltergeist'

Capybara.default_driver = :poltergeist
Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app, {
    :phantomjs_options => ["--ignore-ssl-errors=yes", "--ssl-protocol=['tlsv1.2']"],
  })
end
session = Capybara::Session.new(:poltergeist)
session.visit ENV["HUB_ENV_URL"]
session.click_button('English')
session.find('a#cy').click
session.fill_in('q', :with => 'search test')
session.click_button('Search')
if session.has_content?("Canlyniadau chwilio am: search test")
  puts "Welsh Search: PASS"
else
  puts "Welsh Search: FAIL"
  exit(-1)
end
