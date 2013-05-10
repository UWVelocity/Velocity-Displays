#!/usr/bin/ruby
require 'sinatra'
require 'json'
require 'sinatra/json'
require 'multi_json'
require 'yaml'

schedule = File.open(File.join(File.dirname(__FILE__), 'sites.yml'), 'r'){|f|YAML.load(f)}["schedule"]

get '/' do
  list = params['list']
  if list
    @list_arg = list
  else
    @list_arg = 'residence'
  end
  erb :display_driver
end

serve_files = %w[addyourstuff]

get %r(/(#{serve_files.collect(&Regexp.method(:escape)).join('|')})/?) do |filename|
  send_file "#{filename}.html"
end

PREFETCH_SIZE = 10

get %r{/pagelist/(\d+)/} do |index|
  index = index.to_i
  list = (index...(index+PREFETCH_SIZE)).collect do |i|
    schedule[i%schedule.size]
  end
  json(list)
end
