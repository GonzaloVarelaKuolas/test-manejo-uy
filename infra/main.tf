terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

data "docker_image" "manejo_uy" {
  name = "manejo-uy:latest"
}

resource "docker_container" "manejo_uy" {
  name  = "manejo-uy"
  image = data.docker_image.manejo_uy.id

  ports {
    internal = 80
    external = 8080
  }
}