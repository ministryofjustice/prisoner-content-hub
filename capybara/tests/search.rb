#!/usr/bin/env ruby

require 'capybara'
require 'capybara/poltergeist'

Capybara.javascript_driver = :poltergeist

session = Capybara::Session.new(:poltergeist)

session.visit ENV['HUB_ENV_URL']

session.fill_in('q', :with => 'search test')
session.click_button('Search')
if session.has_content?("Search Results for: search test")
  puts "PASS"
else
  puts "FAIL"
  exit(-1)
end
