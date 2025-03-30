package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server struct {
		Port int `yaml:"port"`
	} `yaml:"main"`

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
	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		configPath = "config.yaml"
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		return fmt.Errorf("failed to read config file %s: %w", configPath, err)
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return fmt.Errorf("failed to unmarshal config file: %w", err)
	}

	fmt.Printf("✅ Loaded config: %+v\n", cfg)

	AppConfig = &cfg
	return nil
}

func GetDBSource() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		getEnv("DB_USER", AppConfig.Database.User),
		getEnv("DB_PASSWORD", AppConfig.Database.Password),
		getEnv("DB_HOST", AppConfig.Database.Host),
		getEnv("DB_PORT", fmt.Sprintf("%d", AppConfig.Database.Port)), // ✅ FIXED HERE
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
