class PenguinController < ApplicationController
  require "uri"
  require "net/http"
  
  def index
    
  end
  
  def dover
    x = Net::HTTP.post_form(URI.parse(params[:url]), params[:data])
    render json: x.body
  end
end