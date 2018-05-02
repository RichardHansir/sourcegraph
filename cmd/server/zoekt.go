package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
)

func maybeZoektProcfile(dataDir string) ([]string, error) {
	enabled, err := strconv.ParseBool(os.Getenv("INDEXED_SEARCH"))
	if err != nil {
		return nil, err
	}
	if !enabled {
		return nil, nil
	}
	indexDir := filepath.Join(dataDir, "zoekt/index")
	return []string{
		fmt.Sprintf("zoekt-indexserver: zoekt-sourcegraph-indexserver -sourcegraph_url http://%s -index %s -interval 1m", frontendInternalHost, indexDir),
		fmt.Sprintf("zoekt-webserver: zoekt-webserver -rpc -pprof -listen %s -index %s", zoektHost, indexDir),
	}, nil
}
