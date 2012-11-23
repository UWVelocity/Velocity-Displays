#!/usr/bin/ruby
require 'sinatra'
require 'json'
require 'sinatra/json'
require 'yaml'

class Page
  #For when I actually get the thing to automatically schedule things, 
  #I don't have time yet, so we're just going to schedule manually for now.

  DICTIONARY_KEYS = [:url, :duration, :refresh]

  attr_reader *DICTIONARY_KEYS

  def initialize(dict)
    DICTIONARY_KEYS.each do |key|
      instance_variable_set(key, dict[key.to_s])
    end
  end

  def density 
    # the percentage of an infinite sequence that this page
    # would take up if it had enough space to do so.
    duration.to_f/refresh
  end

  def adjust(factor)
    # scales density by inversely scaling refresh period
    refresh /= factor
  end

  def to_json
    super(Hash[DICTIONNARY_KEYS.collect{|k| self.send(k)}])
  end
end

schedule = File.open(File.join(File.dirname(__FILE__), 'sites.yml'), 'r'){|f|YAML.load(f)}["schedule"]

get '/' do
  send_file 'display_driver.html'
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
