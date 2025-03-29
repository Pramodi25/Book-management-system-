package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server struct {
		Port int `yaml:"port"`
	} `yaml:"server"`

	Database struct {
		Host     string `yaml:"host"`
		Port     int    `yaml:"port"`
		User     string `yaml:"user"`
		Password string `yaml:"password"`
		DBName   string `yaml:"dbname"`
		SSLMode  string `yaml:"sslmode"`
	} `yaml:"database"`
}

var AppConfig *Config

func Init() error {
	data, err := os.ReadFile("config.yaml")
	if err != nil {
		return err
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return err
	}

	AppConfig = &cfg
	return nil
}

func GetDBSource() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=%s",
		getEnv("DB_USER", AppConfig.Database.User),
		getEnv("DB_PASSWORD", AppConfig.Database.Password),
		getEnv("DB_HOST", AppConfig.Database.Host),
		getEnv("DB_PORT", fmt.Sprint(AppConfig.Database.Port)),
		getEnv("DB_NAME", AppConfig.Database.DBName),
		getEnv("DB_SSLMODE", AppConfig.Database.SSLMode),
	)
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}
