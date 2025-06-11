require 'yaml'
require 'fileutils'

holyplaces = YAML.load_file('_data/holyplaces.yml')

holyplaces.each do |place|
  filename = "holyplace/#{place['id']}.html"
  FileUtils.mkdir_p(File.dirname(filename))
  
  File.open(filename, 'w') do |file|
    file.write("---\n")
    file.write("layout: holyplace\n")
    file.write("place_id: #{place['id']}\n")
    file.write("title: #{place['name']}\n")
    file.write("---\n")
  end
end

puts "Генерирани #{holyplaces.length} страници за свети места."