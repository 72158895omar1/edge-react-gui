import { describe, expect, it, jest } from '@jest/globals'
import { Mock } from 'jest-mock' // Import Mock type from jest-mock if needed
import * as React from 'react'
import { View } from 'react-native'
import TestRenderer from 'react-test-renderer'

import { EdgeTouchableOpacity } from '../../components/common/EdgeTouchableOpacity'
import { EdgeText } from '../../components/themed/EdgeText'
import { CardUi4 } from '../../components/ui4/CardUi4'
import { FakeProviders } from '../../util/fake/FakeProviders'

const testColors = ['#4c669f', '#3b5998', '#192f6a']
const testIconUri = 'https://content.edge.app/currencyIconsV3/bitcoin/bitcoin.png'

describe('Card', () => {
  it('should render with gradient background', () => {
    const gradientProps = {
      colors: testColors,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    }
    const renderer = TestRenderer.create(
      <FakeProviders>
        <CardUi4 gradientBackground={gradientProps}>
          <EdgeText>Gradient Background</EdgeText>
        </CardUi4>
      </FakeProviders>
    )
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('should render with node background', () => {
    const nodeBackground = <View style={{ height: 100, width: 100, backgroundColor: testColors[0] }} />
    const renderer = TestRenderer.create(
      <FakeProviders>
        <CardUi4 nodeBackground={nodeBackground}>
          <EdgeText>Node Background</EdgeText>
        </CardUi4>
      </FakeProviders>
    )
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('should render with icon URI', () => {
    const renderer = TestRenderer.create(
      <FakeProviders>
        <CardUi4 icon={testIconUri}>
          <EdgeText>Icon</EdgeText>
        </CardUi4>
      </FakeProviders>
    )
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('should render sections correctly with multiple children', () => {
    const renderer = TestRenderer.create(
      <FakeProviders>
        <CardUi4 sections>
          <EdgeText>Section 1</EdgeText>
          <EdgeText>Section 2</EdgeText>
        </CardUi4>
      </FakeProviders>
    )
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('should handle press and long press events', () => {
    const mockOnPress: Mock<() => void | Promise<void>> = jest.fn()
    const mockOnLongPress: Mock<() => void | Promise<void>> = jest.fn()

    const testRenderer = TestRenderer.create(
      <FakeProviders>
        <CardUi4 onPress={mockOnPress} onLongPress={mockOnLongPress}>
          <EdgeText>Press Me</EdgeText>
        </CardUi4>
      </FakeProviders>
    )

    testRenderer.root.findByType(EdgeTouchableOpacity).props.onPress()
    expect(mockOnPress).toHaveBeenCalled()

    testRenderer.root.findByType(EdgeTouchableOpacity).props.onLongPress()
    expect(mockOnLongPress).toHaveBeenCalled()

    expect(testRenderer.toJSON()).toMatchSnapshot()
  })

  it('should expand to fill its parent container', () => {
    const testRenderer = TestRenderer.create(
      <FakeProviders>
        <View style={{ flex: 1 }}>
          <CardUi4>
            <EdgeText>Child Content</EdgeText>
          </CardUi4>
        </View>
      </FakeProviders>
    )
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })

  it('should allow child elements to expand within the card', () => {
    const testRenderer = TestRenderer.create(
      <FakeProviders>
        <CardUi4>
          <View style={{ flex: 1, backgroundColor: testColors[0] }}>
            <EdgeText>Expanding Child</EdgeText>
          </View>
        </CardUi4>
      </FakeProviders>
    )
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })

  it('should expand both the card and its children to fill available space', () => {
    const testRenderer = TestRenderer.create(
      <FakeProviders>
        <View style={{ flex: 1 }}>
          <CardUi4 fill>
            <View style={{ flex: 1, backgroundColor: testColors[0] }}>
              <EdgeText>Expanding Child in Expanding Card</EdgeText>
            </View>
          </CardUi4>
        </View>
      </FakeProviders>
    )
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })
})
