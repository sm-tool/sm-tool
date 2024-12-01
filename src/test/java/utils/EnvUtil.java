package utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.stream.Collectors;

public class EnvUtil {

  public static Map<String, String> loadEnvFile(String envFile) {
    try {
      return Files.readAllLines(Path.of(envFile))
        .stream()
        .filter(line -> line.contains("="))
        .map(line -> line.split("=", 2))
        .collect(Collectors.toMap(parts -> parts[0], parts -> parts[1]));
    } catch (IOException e) {
      throw new RuntimeException("Cannot read file: " + envFile, e);
    }
  }
}
