package nats

import (
	"fmt"

	"github.com/nats-io/nats.go"
)

// Connect establishes a connection to NATS JetStream
func Connect(url string) (*nats.Conn, error) {
	opts := []nats.Option{
		nats.Name("Farutech Orchestrator Worker"),
		nats.MaxReconnects(-1), // Unlimited reconnects
		nats.ReconnectWait(nats.DefaultReconnectWait),
		nats.DisconnectErrHandler(func(nc *nats.Conn, err error) {
			if err != nil {
				fmt.Printf("NATS disconnected: %v\n", err)
			}
		}),
		nats.ReconnectHandler(func(nc *nats.Conn) {
			fmt.Printf("NATS reconnected: %s\n", nc.ConnectedUrl())
		}),
	}

	nc, err := nats.Connect(url, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to NATS: %w", err)
	}

	// Verify JetStream is enabled
	js, err := nc.JetStream()
	if err != nil {
		nc.Close()
		return nil, fmt.Errorf("JetStream not enabled: %w", err)
	}
	
	_ = js // Use JetStream later for stream operations

	return nc, nil
}
