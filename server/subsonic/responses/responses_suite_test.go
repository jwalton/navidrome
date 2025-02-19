package responses

import (
	"testing"

	"github.com/bradleyjkemp/cupaloy"
	"github.com/deluan/navidrome/log"
	"github.com/onsi/ginkgo"
	"github.com/onsi/gomega"
	"github.com/onsi/gomega/types"
)

func TestSubsonicApiResponses(t *testing.T) {
	log.SetLevel(log.LevelError)
	gomega.RegisterFailHandler(ginkgo.Fail)
	ginkgo.RunSpecs(t, "Subsonic API Responses Suite")
}

func MatchSnapshot() types.GomegaMatcher {
	c := cupaloy.New(cupaloy.FailOnUpdate(false))
	return &snapshotMatcher{c}
}

type snapshotMatcher struct {
	c *cupaloy.Config
}

func (matcher snapshotMatcher) Match(actual interface{}) (success bool, err error) {
	err = matcher.c.SnapshotMulti(ginkgo.CurrentGinkgoTestDescription().FullTestText, actual)
	success = err == nil
	return
}

func (matcher snapshotMatcher) FailureMessage(actual interface{}) (message string) {
	return "Expected to match saved snapshot\n"
}

func (matcher snapshotMatcher) NegatedFailureMessage(actual interface{}) (message string) {
	return "Expected to not match saved snapshot\n"
}
