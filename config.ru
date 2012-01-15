require 'sinatra'

Sinatra::Application.run = false
Sinatra::Application.environment = ENV['RACK_ENV']

require './server'
run Sinatra::Application
