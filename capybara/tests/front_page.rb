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
if session.has_content?("Video")
  puts "Front page: PASS"
else
  puts "Front page: FAIL"
  exit(-1)
end
