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
session.visit ENV['HUB_ENV_URL']
session.fill_in('q', :with => 'search test')
session.click_button('Search')
if session.has_content?("Search Results for: search test")
  puts "Search: PASS"
else
  puts "Search: FAIL"
  exit(-1)
end
