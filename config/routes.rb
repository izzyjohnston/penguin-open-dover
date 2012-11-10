PenguinRails::Application.routes.draw do
  root :to => "penguin#index"
  post '/open-dover' => "penguin#dover"
end
