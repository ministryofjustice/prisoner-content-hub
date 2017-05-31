#!/usr/bin/env ruby

require 'capybara'
require 'capybara/poltergeist'

Capybara.javascript_driver = :poltergeist

session = Capybara::Session.new(:poltergeist)

session.visit ENV['HUB_ENV_URL']

if session.has_content?("Video")
  puts "Pass"
else
  puts "FAIL"
  exit(-1)
end
